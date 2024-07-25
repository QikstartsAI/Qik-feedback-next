import { Console } from 'console'
import React, { useEffect, useState } from 'react'
import { Branch } from '../types/business'
import { array } from 'zod'

export const useDistanceMatrix = () => {
  //Coordenada de origen del cliente en este caso
  const [origin, setOrigin] = useState('')
  //Coordenadas de las sucursales

  const [destinations, setDestinations] = useState<Branch[]>([])
  //se escoge la sucursal mas cercana al cliente
  const [closestDestination, setClosestDestination] = useState<Branch>()
  const coordenates = destinations.map((destination) => destination.Address)

  const setDistanceMatrix = ({
    origin,
    destinations = [],
    quantity = 1,
  }: {
    origin: string
    destinations?: Branch[]
    quantity?: number
  }) => {
    setOrigin(origin)
    setDestinations(destinations)
  }

  const api_key = 'AIzaSyAi6PkMJjAu_c_hqYmFXDmIIbywVKn7RLk'

  const formatQueryParam = (arr: string[]) => {
    return arr.map(encodeURIComponent).join('|')
  }

  const getDistanceMatrix = async () => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${formatQueryParam(
          coordenates
        )}&origins=32.5890563,-85.4710127&units=imperial&key=${api_key}`,
        {
          mode: 'cors',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      const data = await res.json()
      console.log(data)

      //array para almacenar los valores
      const distanceArr: number[] = data.rows[0].elements.map(
        (element: any) => element['distance'].value
      )
      /*
      for (let i = 0; i < data.rows.length; i++) {
        const row = data.rows[i]
        for (let j = 0; j < row.elements.length; j++) {
          const resul = row.elements[j]
          //console.log(resul)
          const distanceValue = resul.distance.value
          //console.log(distanceValue)
          distanceArr.push(distanceValue)
          //console.log(distanceArr)
        }
      }*/
      // Encontrar el valor más pequeño en el arreglo de distancias

      const minDistance: number = Math.min(...distanceArr)
      const closerBranchIndex = distanceArr.findIndex(
        (distance) => distance == minDistance
      )
      setClosestDestination(destinations[closerBranchIndex])
      console.log(minDistance)
      console.log(distanceArr)
    } catch (err) {
      throw new Error('error al hacer el fetching de datos' + err)
    }
  }
  useEffect(() => {
    console.log(origin, destinations)
    if (origin == '' || destinations.length == 0) {
      return
    }
    getDistanceMatrix()
  }, [origin, destinations])
  return { closestDestination, setDistanceMatrix }
}
