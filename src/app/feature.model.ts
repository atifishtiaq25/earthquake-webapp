import { property } from './property.model';
import { Geometry } from './geometry.model'

export class Feature {
    public type: any;
    public properties: property; 
    public geometry: Geometry;
    public id: string;
}