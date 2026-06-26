import { useEffect, useState } from "react";
import { getAnnouncements }
from "../api/studentApi";

import AnnouncementList
from "../components/AnnouncementList";

function Announcements() {

  const [announcements,
         setAnnouncements] = useState([]);

  useEffect(() => {

    getAnnouncements()
      .then(res =>
        setAnnouncements(res.data))
      .catch(console.error);

  }, []);

  return (
    <AnnouncementList
      announcements={announcements}
    />
  );
}

export default Announcements;