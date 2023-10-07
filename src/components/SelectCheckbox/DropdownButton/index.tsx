import style from './style.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownButton = ({ isOpen, onPress, onClear, children }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clearMultipleSelectStopPropagation = (event: any) => {
    event.stopPropagation();
    onClear();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shouldShowClearIcon = (): any => {
    if (children !== ' 0 selected') {
      return (
        <span
          className={style.spanIcon}
          style={{ padding: '2px 8px', color: isOpen ? '#000' : '#ccc' }}
          onClick={clearMultipleSelectStopPropagation}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            className="css-tj5bde-Svg"
          >
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
          </svg>
        </span>
      );
    }
    return null;
  };
  return (
    <>
      <button onClick={onPress} className={style.dropdownButton}>
        <span className={style.spanInfo}>{children}</span>
        {shouldShowClearIcon()}
        <span className={style.indicatorSeparator}></span>
        <span style={{ color: isOpen ? '#000' : '#ccc' }} className={style.spanIcon}>
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            className="css-tj5bde-Svg"
          >
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </span>
      </button>
    </>
  );
};

export default DropdownButton;
