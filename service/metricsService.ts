import { listarDadosAgregados } from '../fetcher/dadosSensor';
import { TipoDadoSensor } from '../types/DadosSensor';
import { FatigueMetrics } from '../model/metrics';

export async function carregarMetricsPorDia(dataISO: string): Promise<FatigueMetrics> {
    const map = await listarDadosAgregados(dataISO);
    const fadiga = calcularFadiga(map);
    const estresse = calcularEstresse(map);
    const recuperacao = calcularRecuperacao(map);
    return {
        fatigueIndex: fadiga,
        stressLevel: estresse,
        recoveryIndex: recuperacao,
        focusTrend: 0,
    };
}

function calcularFadiga(map: Record<TipoDadoSensor, number>): number {
    const sono = map.SONO_HORAS ?? 6;
    return Math.round((10 - sono) * 10);
}

function calcularEstresse(map: Record<TipoDadoSensor, number>): number {
    const bpm = map.BATIMENTOS_MEDIOS ?? 70;
    return Math.round(Math.min(100, Math.max(0, (bpm - 60) * 2)));
}

function calcularRecuperacao(map: Record<TipoDadoSensor, number>): number {
    const passos = map.ATIVIDADE_PASSOS ?? 5000;
    return Math.round(Math.min(100, passos / 100));
}
