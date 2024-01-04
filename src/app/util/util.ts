import { Observable } from "rxjs";

export function createHttpObservable(url:string): Observable<any> {
    return new Observable(
       
        (subscriber)=>{
            const controller = new AbortController();
            const signal = controller.signal;

            console.log('Subscription started');
            fetch(url, {signal}).then(
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

            return controller.abort;
        }

        
    )
}