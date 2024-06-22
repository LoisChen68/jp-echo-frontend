import { Fragment } from "react";

const CaptionsBlock = ({ text }: { text: string }) => {
  return (
    <>
      {text.split("\n").map((t) => (
        <Fragment key={t}>
          {t.split("\\n").map((v) => (
            <Fragment key={v}>
              {v}
              <br />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default CaptionsBlock;
