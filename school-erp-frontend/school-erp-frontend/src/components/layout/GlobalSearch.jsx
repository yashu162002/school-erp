import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, User } from "lucide-react";
import { studentsApi } from "@/api/students.api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

/**
 * Global search — wired to the real GET /admin/students/search?name=
 * endpoint. Only students are searchable right now because that's the
 * only search endpoint the backend exposes (no teacher/parent search).
 */
export function GlobalSearch({ className }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isFetching } = useQuery({
    queryKey: ["global-search-students", debouncedQuery],
    queryFn: () => studentsApi.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 1,
  });

  const results = data ?? [];
  const showDropdown = isFocused && debouncedQuery.trim().length > 1;

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-sm", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        placeholder="Search students…"
        className="h-9 w-full rounded-md border border-border bg-muted/60 pl-8 pr-3 text-sm outline-none transition-colors focus:border-ring focus:bg-surface"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-surface shadow-lg scrollbar-thin">
          {isFetching ? (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </div>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No students found.</p>
          ) : (
            results.map((s) => (
              <button
                key={s.id}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  setQuery("");
                  navigate("/admin/students");
                }}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{s.firstName} {s.lastName}</span>
                <span className="ml-auto text-xs text-muted-foreground">{s.admissionNo}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
