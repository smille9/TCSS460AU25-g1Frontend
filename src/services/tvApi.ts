import { tvService } from 'utils/axios';

export const tvApi = {
    search: (config: { params: { name: string } }) => tvService.get('/series', config)
};
