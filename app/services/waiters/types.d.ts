interface WaiterI {
  id: string;
  name: string;
  gender: string;
  latestSum: number;
  numberOfSurveys: number;
  ratingAverage: number;
}

interface WaiterSucursalI extends WaiterI {
  sucursalId: string;
  sucursal: BusinessSucursalI;
}
