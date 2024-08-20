import Option from "./Option";

const OptionsList = ({ options = [], ...rest }) => {
  console.log(options);
  return (
    <div className="mt-4 mb-4 ">
      <ol className="flex flex-col rounded-md ">
        {options?.map(({ value, id, rightAnswer }, index) => {
          return (
            <li key={index} className=" list-decimal   min-w-12 ">
              <Option
                option={value}
                optionId={id}
                rightAnswer={rightAnswer}
                {...rest}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OptionsList;
