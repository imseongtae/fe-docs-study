interface Avatar {
  name: string;
  imageId: string;
}

const Avatar = ({ person, size = 100 }: { person: Avatar; size?: number }) => {
  // const imageUrl = 'https://i.imgur.com/1bX5QH6.jpg';
  const baseUrl = 'https://i.imgur.com/';
  const altText = person.name;

  return (
    <img
      className="avatar"
      src={`${baseUrl}${person.imageId}.jpg`}
      alt={altText}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
