import CustomRadioGroup from '@/app/components/form/CustomRadioGroup';


import FeedBackForm from '../hooks/FeedBackForm.json'



export const Wizard = () => {
  const questions = FeedBackForm.templates[0].questions;

  const renderInput = (question: any) => {
    const { id, label, type, placeholder, required, max, ischecked, options } = question;

    switch (id) {
      case 'emailfield':
        return (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              required={required}
            />
          </div>
        );

      case 'askname':
        return (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              required={required}
            />
          </div>
        );

      case 'askphonenumber':
        return (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type="tel"
              placeholder={placeholder}
              required={required}
            />
          </div>
        );

      case 'promotionscheckbox':
        return (
          <div key={id}>
            <label htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                defaultChecked={ischecked}
                required={required}
              />
              {label}
            </label>
          </div>
        );

      case 'askbirthday':
        return (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type="date"
              max={max}
              placeholder={placeholder} 
            />
          </div>
        );

        case 'socialmedia':
          return (
            <div key={id}>
              <label htmlFor={id}>{label}</label>

            {/* <CustomRadioGroup
              items={options.map((option: any) => ({
                value: option.id,
                label: option.label,
              }))}
              value=""
              
              /> */}
              
            </div>
          )

      default:
        return null;
    }
  };

  return (
    <form>{questions.map(renderInput)}</form>
  )
};