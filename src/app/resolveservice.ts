/*
export class Resolve {
}
*/
import { Injectable } from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface EndpointComponent {
    endpoint: string;
}

@Injectable()
export class Resolveservice implements Resolve<EndpointComponent> {

    constructor(private _apiService: ApiService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        // let id = route.params['id'];
        console.log('resolve route data');
        let endpoint: any = route.data;
        let condition: any = {};
        if ( endpoint.condition != '_id' || endpoint.condition != null) {
            for (let v in endpoint.condition) {
                if (v == '_id') {
                    endpoint.condition[v] = route.params.id;
                    console.log(route.params.id);
                }
            }
            // condition = endpoint.condition;
        // && endpoint.condition[v].indexOf('modelid') > -1

        } else {
            // alert(66);
        }


        console.log(route.data);
        console.log(route.data.source);
        console.log('route.params.id');
        console.log(route.params);
        console.log(route.params.id);
        console.log(route);
        console.log(state);
        console.log('endpoint in resolve ...');
        console.log(endpoint);
        // let endpoint = route.data.object;
        // console.log('endpoint!!!!!');
        // console.log(endpoint);
        return new Promise((resolve) => {
            this._apiService.getEndpoint(endpoint).subscribe(api_object => {
                console.log('api_object  !!!!');
                console.log(api_object);
                if (api_object) {
                    return resolve(api_object);
                } /*else { // id not found
                    this.router.navigateByUrl('/');
                    return true;
                }*/
            });

        });
    }
}
