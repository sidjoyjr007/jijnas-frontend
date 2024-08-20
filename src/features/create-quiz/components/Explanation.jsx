import Editor from "../../../components/Editor";
const explanation = ({ explaintionModel, setModel }) => {
  return (
    <div>
      <div className="mb-2 block text-sm font-medium leading-6 text-gray-200">
        Answer explanation
      </div>
      <Editor model={explaintionModel} type="explanation" setModel={setModel} />
    </div>
  );
};

export default explanation;
