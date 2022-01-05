import { useForm } from 'react-hook-form';

export default function StatusEditor({status, onSubmit}) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {status.statusFields.forEach(({name, type}) => {
        const SetterComponent = Types.types[type].setterComponent;
        return <SetterComponent
                  label={name}
                  register={register}
                  errors={errors}/>;
      })}
    </form>
  );
}