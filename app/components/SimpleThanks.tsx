const SimpleThanks = () => {
  setTimeout( () => {window.location.reload()}, 2000);

  return (
    <div className={'w-full flex flex-col items-center justify-center h-screen bg-primary px-10'}>
      <h1 className="text-8xl text-white font-bold text-center mb-8">
        YOUR OPINION
        COUNTS A LOT!
      </h1>
      <h2 className="text-6xl text-white font-bold text-center">
        IT WILL HELP US IMPROVE
      </h2>
      <div className="border border-white bg-white h-1 w-16 self-center my-6"/>
      <p className="text-4xl text-white font-bold text-center">
        Thanks for sharing your experience!
      </p>
    </div>
  )
}

export default SimpleThanks
