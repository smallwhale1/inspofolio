type Props = {
  imgSrc: string;
};

const ImageView = ({ imgSrc }: Props) => {
  return (
    <img
      onClick={(e) => {
        e.stopPropagation();
      }}
      src={imgSrc}
      height={"100%"}
    />
  );
};

export default ImageView;
