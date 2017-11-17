import { requestRecommendedThemes } from '../netAccess/themes';
import { Store } from '../mainReducer';

export type AsyncFetchAction = {
    type: string,
    payload?: Store['recommendedThemes'] | Error
};

export const fetchRecommendedThemes = () => ({
    type: 'FETCH_RECOMMENDED_THEMES',
    payload: requestRecommendedThemes()
});