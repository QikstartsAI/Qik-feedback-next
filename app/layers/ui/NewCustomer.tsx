import DefaultFormNew from '../hooks/DefaultFormNew.json';

export const NewCustomer = () => {
  const sectionOne = DefaultFormNew["form-one"][0]["Section-form-one"];

  return (
    <div className=''>
    <form id={DefaultFormNew.id} className="space-y-6 p-4">
      {sectionOne.map((field) => {
        if (field.type === "textbox") {
          return (
            <div key={field.id} className="flex flex-col">
              <label
                htmlFor={field.id}
                className={`mb-2 ${field["label-text-style"]}`}
              >
                {field.label} {field.required}
              </label>
              <input
                id={field.id}
                type="text"
                required={field.required}
                className={`border border-gray-300 rounded-md p-2 ${field.centerText}`}
              />
            </div>
          );
        }

        if (field.type === "checkbox") {
          return (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                id={field.id}
                type="checkbox"
                defaultChecked={field.ischecked}
                required={field.required}
                className="h-5 w-5 text-blue-600"
              />
              <label
                htmlFor={field.id}
                className={`${field["label-text-style"]}`}
              >
                {field.label}
              </label>
            </div>
          );
        }

        return null;
      })}
    </form>

    </div>
  );
};
