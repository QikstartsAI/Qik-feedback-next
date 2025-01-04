export const CustomerQuestion = () => {
 return (
  <div className="text-center mt-10">
    <h1 className="text-primary font-bold md:text-2xl max-sm:text-2xl">¿Eres cliente nuevo o frecuente?</h1>
    <p className="text-gray-600">Valoramos tu opinión 😃,te tomará menos de 1 minuto</p>

    <div className="flex mt-7 justify-center items-center">

    <button className="flex flex-col items-center">
      <img src="/yellow-start.png" style={{ maxWidth: "180px" }} />
      <h1 className="text-gray-800 md:text-xl font-bold">Nuevo</h1>
    </button>


    <button className="flex flex-col items-center">
      <img src="/gray-heart.png" style={{ maxWidth: "180px" }} />
      <h1 className="text-gray-800 md:text-xl font-bold">Frecuente</h1>
    </button>

    </div>
  </div>
 )
}