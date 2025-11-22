import { CheckinManualRequest, CheckinManualResponse, ValorEnum } from '../types/Checkin';
import { postCheckinManual, listarCheckinsUsuario } from '../fetcher/checkin';
import { EntradaBemEstar } from '../model/wellbeing';

function enumToScore(v: ValorEnum): number {
    switch (v) {
        case 'MUITO_BAIXO': return 1;
        case 'BAIXO': return 2;
        case 'MEDIO': return 3;
        case 'ALTO': return 4;
        case 'MUITO_ALTO': return 5;
    }
}

function scoreToEnum(s: number): ValorEnum {
        if (s <= 1) return 'MUITO_BAIXO';
        if (s === 2) return 'BAIXO';
        if (s === 3) return 'MEDIO';
        if (s === 4) return 'ALTO';
        return 'MUITO_ALTO';
}

function mapCheckinToEntry(dto: CheckinManualResponse): EntradaBemEstar {
    return {
        id: String(dto.chekinId),
        userId: String(dto.usuarioId),
        mood: enumToScore(dto.humor),
        energy: enumToScore(dto.energia),
        focus: enumToScore(dto.foco),
        createdAt: dto.time,
        source: 'manual',
    };
}

export async function salvarCheckin(mood: number, energy: number, focus: number): Promise<EntradaBemEstar> {
    // Recupera email do usuário logado
    let email = '';
    try {
      const sessionRaw = await import('../service/authService');
      const session = await sessionRaw.getSession();
      email = session?.user?.email || '';
    } catch {}
    const body: CheckinManualRequest = {
        humor: scoreToEnum(mood),
        energia: scoreToEnum(energy),
        foco: scoreToEnum(focus),
        email,
    };
    const dto = await postCheckinManual(body);
    return mapCheckinToEntry(dto);
}

export async function carregarCheckins(): Promise<EntradaBemEstar[]> {
        try {
            const list = await listarCheckinsUsuario();
            return list.map(mapCheckinToEntry);
        } catch (error: any) {
            if (error?.response?.status === 404) {
                console.error('[CHECKIN] Erro 404 ao buscar histórico:', error?.response?.data);
                return [];
            }
            console.error('[CHECKIN] Erro ao buscar histórico:', error);
            throw error;
        }
}
