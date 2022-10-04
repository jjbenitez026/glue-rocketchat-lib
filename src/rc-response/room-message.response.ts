import { RcBaseResponse } from './response';
import { CollectionType } from '../types/collection.type';
import { Field } from '../rc-events/field';

export interface RoomMessageResponse extends RcBaseResponse {
    collection: CollectionType;
    fields: Field;
}
