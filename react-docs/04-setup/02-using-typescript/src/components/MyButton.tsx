interface MyButtonProps {
  /** 버튼 안에 보여질 텍스트 */
  title: string;
  /** 버튼이 상호작용할 수 있는지 여부 */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  const onClickButton = () => {
    alert('button is clicked!');
  };

  return (
    <button disabled={disabled} onClick={onClickButton}>
      {title}: {`button is ${disabled}`}
    </button>
  );
}

export default MyButton;
