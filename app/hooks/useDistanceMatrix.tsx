import React, { useCallback, useEffect, useState } from 'react'
import { Branch } from '../types/business'

export const useDistanceMatrix = () => {
  const [origin, setOrigin] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null })
  const [destinations, setDestinations] = useState<Branch[]>([])
  const [closestDestination, setClosestDestination] = useState<Branch | Branch[]>()
  // const coordenates = destinations.map((destination) => destination.Address)
  // const [data, setData] = useState<google.maps.DistanceMatrixResponse | null>(null)

  const setDistanceMatrix = useCallback(({ origin, destinations = [] }: { origin: { latitude: number | null; longitude: number | null }; destinations?: Branch[] }) => {
    setOrigin(origin)
    setDestinations(destinations)
  }, [])

  const getDistanceMatrix = useCallback(async () => {
    try {
      if (origin.latitude === null || origin.longitude === null) {
        return
      }

      setClosestDestination(destinations);

      // const originInCoordinates = new google.maps.LatLng(origin.latitude, origin.longitude)
      // const service = new google.maps.DistanceMatrixService()
      // service.getDistanceMatrix(
      //   {
      //     origins: [originInCoordinates],
      //     destinations: coordenates,
      //     travelMode: google.maps.TravelMode.DRIVING,
      //     unitSystem: google.maps.UnitSystem.METRIC,
      //   },
      //   (response, status) => {
      //     setData(response)
      //     if (response === null) {
      //       return
      //     }

      //     const elements = response.rows[0].elements;

      //     // Filtramos los elementos que tienen el estado "OK" y obtenemos sus distancias
      //     const validElements = elements
      //       .map((element, index) => ({ ...element, index }))
      //       .filter((element: google.maps.DistanceMatrixResponseElement & { index: number }) => element.status === 'OK');

      //     // Verificamos si todos los elementos son "ZERO_RESULTS" o "NOT_FOUND"
      //     const allZeroResultsOrNotFound = validElements.length === 0;

      //     if (allZeroResultsOrNotFound) {
      //       console.error('Si hay origen pero por la lejania no se puede obtener las distancias de las demas sucursales');
      //       return;
      //     }

      //     // Obtenemos las distancias de los elementos válidos
      //     const distanceArr: number[] = validElements.map(
      //       (element: google.maps.DistanceMatrixResponseElement) => element.distance.value
      //     );

      //     if (distanceArr.length === 0) {
      //       return;
      //     }

      //     // Encontramos la distancia mínima y el índice del elemento correspondiente
      //     const minDistance: number = Math.min(...distanceArr);
      //     const closerBranchIndex = validElements.find(
      //       (element: google.maps.DistanceMatrixResponseElement) => element.distance.value === minDistance
      //     )?.index;

      //     if (closerBranchIndex === undefined) {
      //       console.error('No se encontró una sucursal más cercana.');
      //       return;
      //     }

      //     setClosestDestination(destinations[closerBranchIndex]);
      //   }
      // )
    } catch (err) {
      console.error('error al hacer el fetching de datos: ', err)
    }
  //}, [origin, coordenates, destinations])
   }, [origin, destinations])

  useEffect(() => {
    if (origin.latitude == null || origin.longitude == null || destinations.length === 0) {
      return
    }
    getDistanceMatrix()
  }, [origin, destinations, getDistanceMatrix])

  return { closestDestination, setDistanceMatrix }
}
