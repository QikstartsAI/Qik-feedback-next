import { Console } from 'console'
import React, { useEffect, useState } from 'react'
import { Branch } from '../types/business'
import { array } from 'zod'

export const useDistanceMatrix = () => {
  //Coordenada de origen del cliente en este caso
  const [origin, setOrigin] = useState<{
    latitude: number | null
    longitude: number | null
  }>({ latitude: null, longitude: null })
  //Coordenadas de las sucursales

  const [destinations, setDestinations] = useState<Branch[]>([])
  //se escoge la sucursal mas cercana al cliente
  const [closestDestination, setClosestDestination] = useState<Branch>()
  const coordenates = destinations.map((destination) => destination.Address)
  const [data, setData] = useState<google.maps.DistanceMatrixResponse | null>(
    null
  )

  const setDistanceMatrix = ({
    origin,
    destinations = [],
    quantity = 1,
  }: {
    origin: { latitude: number | null; longitude: number | null }
    destinations?: Branch[]
    quantity?: number
  }) => {
    setOrigin(origin)
    setDestinations(destinations)
  }

  const getDistanceMatrix = async () => {
    try {
      if (origin.latitude === null || origin.longitude === null) {
        return
      }
      const originInCoordinates = new google.maps.LatLng(
        origin.latitude,
        origin.longitude
      )
      var service = new google.maps.DistanceMatrixService()
      service.getDistanceMatrix(
        {
          origins: [originInCoordinates],
          destinations: coordenates,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          setData(response)
          console.log('datos', response)
          if (response === null) {
            return
          }
          //array para almacenar los valores
          const distanceArr: number[] = response.rows[0].elements.map(
            (element: google.maps.DistanceMatrixResponseElement) =>
              element.distance.value
          )
          // Encontrar el valor más pequeño en el arreglo de distancias
          const minDistance: number = Math.min(...distanceArr)
          const closerBranchIndex = distanceArr.findIndex(
            (distance) => distance == minDistance
          )
          setClosestDestination(destinations[closerBranchIndex])
          console.log('minDistance', minDistance)
          console.log('todas las distancias', distanceArr)
          console.log('response', response, status)
        }
      )
    } catch (err) {
      throw new Error('error al hacer el fetching de datos' + err)
    }
  }
  useEffect(() => {
    console.log(origin, destinations)
    if (
      origin.latitude == null ||
      origin.longitude == null ||
      destinations.length == 0
    ) {
      return
    }
    getDistanceMatrix()
  }, [origin, destinations])
  return { closestDestination, setDistanceMatrix }
}
