import React, { useCallback, useEffect, useState } from 'react'
import { Branch } from '../types/business'
import useGetBusinessData from './useGetBusinessData'
import { Console } from 'console'

export const useDistanceMatrix = () => {
  // Coordenada de origen del cliente en este caso
  const [origin, setOrigin] = useState<{
    latitude: number | null
    longitude: number | null
  }>({ latitude: null, longitude: null })
  // Coordenadas de las sucursales
  const [destinations, setDestinations] = useState<Branch[]>([])
  // Se escoge la sucursal más cercana al cliente
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

  const getDistanceMatrix = useCallback(async () => {
    try {
      if (origin.latitude === null || origin.longitude === null) {
        return
      }
      const originInCoordinates = new google.maps.LatLng(
        origin.latitude,
        origin.longitude
      )
      console.log(originInCoordinates)
      const service = new google.maps.DistanceMatrixService()
      service.getDistanceMatrix(
        {
          origins: [originInCoordinates],
          destinations: coordenates,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          setData(response)
          if (response === null) {
            return
          }

          //si no hay resultados retorna
          console.log(response)
          const withOutResults = response.rows[0].elements[0].status
          if (withOutResults === 'ZERO_RESULTS' || withOutResults === 'NOT_FOUND') {
            throw new Error(
              'Si hay origen pero por la lejania no se puede obtener las distancias de las demas sucursales'
            )
          }
          // logica si la respuesta es correcta - Array para almacenar los valores
          const distanceArr: number[] = response.rows[0].elements.map(
            (element: google.maps.DistanceMatrixResponseElement) =>
              element.distance.value
          )
          // Encontrar el valor más pequeño en el arreglo de distancias
          const minDistance: number = Math.min(...distanceArr)
          const closerBranchIndex = distanceArr.findIndex(
            (distance) => distance === minDistance
          )
          setClosestDestination(destinations[closerBranchIndex])
        }
      )
    } catch (err) {
      throw new Error('error al hacer el fetching de datos: ' + err)
    }
  }, [origin, coordenates, destinations])

  useEffect(() => {
    if (
      origin.latitude == null ||
      origin.longitude == null ||
      destinations.length === 0
    ) {
      return
    }
    getDistanceMatrix()
  }, [origin, destinations, getDistanceMatrix])

  return { closestDestination, setDistanceMatrix }
}
