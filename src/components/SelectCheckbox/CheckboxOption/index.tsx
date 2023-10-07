import { css, cx } from '@emotion/css';

type JsonObj = { [key: string]: string | number };

export const jsonToCSS = (JS: { [key: string]: string | number | JsonObj }, tab = 0) => {
  let cssString = '';
  const space = ''.padStart(tab * 2, ' ');
  if (JS) {
    for (const [objectKey, objectValue] of Object.entries(JS)) {
      cssString += space + objectKey.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
      if (typeof objectValue == 'object') {
        cssString += ' { \n';
        cssString += jsonToCSS(objectValue, tab + 1);
        cssString += '} \n';
      } else {
        cssString += ': ' + objectValue + ';\n';
      }
    }
  }

  return cssString;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CheckboxOption(props: any) {
  const { children, className, getStyles, isSelected, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      className={cx(
        css`
          ${jsonToCSS(getStyles('option', props))}
          display: flex;
          aling-content: center;

          &:hover {
            background-color: #aaa;
          }

          &:active {
            background-color: #888;
          }
        `,
        className,
      )}
      {...innerProps}
    >
      <input
        readOnly
        type="checkbox"
        checked={isSelected}
        className={cx(
          css`
            appearance: none;
            background-color: #fff;
            margin: 2px 8px 0 0;
            font: inherit;
            color: #444;
            width: 1.15em;
            height: 1.15em;
            border: 0.15em solid #aaa;
            border-radius: 0.15em;
            transform: translateY(-0.075em);
            display: grid;
            place-content: center;

            &::before {
              content: '';
              width: 0.65em;
              height: 0.65em;
              transform: scale(0);
              transition: 120ms transform ease-in-out;
              box-shadow: inset 1em 1em #666;
              clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
              -webkit-clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
            }

            &:checked::before {
              transform: scale(1);
            }
          `,
          className,
        )}
      />
      {children}
    </div>
  );
}
