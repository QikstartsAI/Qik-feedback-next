export const PersonalQuestions = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-center">
        <label htmlFor="username" className="text-sm font-medium text-gray-700 flex justify-center">
          Correo electrónico
        </label>
        <input
        id="username"
        type="text"
        placeholder="Ingresa tu nombre"
        className="border border-gray-300 rounded-lg w-64 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-red-500">El campo es obligatorio</span>
        </div>
        <div className="flex justify-center">
        <label htmlFor="username" className="text-sm font-medium text-gray-700 flex justify-center">
        Nombre Completo 
        </label>
        <input
        id="username"
        type="text"
        placeholder="Ingresa tu nombre"
        className="border border-gray-300 rounded-lg w-64 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-red-500">El campo es obligatorio</span>
      </div>

</div>
  )
}