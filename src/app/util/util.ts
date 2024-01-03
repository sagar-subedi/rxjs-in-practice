import { Observable } from "rxjs";

export function createHttpObservable(url:string): Observable<any> {
    return new Observable(
        (subscriber)=>{

            console.log('Subscription started');
            fetch(url).then(
                (response)=>{
                    return response.json();
                }
            ).then(
                (jsonData) => {
                   subscriber.next(jsonData);
                   subscriber.complete();   
                }
            ).catch(
                (err)=>{
                    subscriber.error(err)
                }
            );
        }
    )
}