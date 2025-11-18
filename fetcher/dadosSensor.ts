import { api } from './http';
import { DadosSensorRequest, DadosSensorResponse, TipoDadoSensor } from '../types/DadosSensor';

export async function postDadoSensor(data: DadosSensorRequest): Promise<DadosSensorResponse> {
  const res = await api.post<DadosSensorResponse>('/dados-sensor', data);
  return res.data;
}

export async function listarDadosSensorUsuario(): Promise<DadosSensorResponse[]> {
  const res = await api.get<DadosSensorResponse[]>('/dados-sensor');
  return res.data;
}

export async function listarDadosAgregados(dataISO: string): Promise<Record<TipoDadoSensor, number>> {
  const res = await api.get<Record<TipoDadoSensor, number>>('/dados-sensor/agregados', { params: { data: dataISO } });
  return res.data;
}
