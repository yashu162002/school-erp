function AnnouncementList({ announcements }) {

  return (
    <div>
      {announcements.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementList;