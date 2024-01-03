import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { createHttpObservable } from '../util/util';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    courses: Course[] = [];

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    

    constructor() {

    }

    ngOnInit() {

        const http$ = createHttpObservable('http://localhost:9000/api/courses');

        const courses$ = http$.pipe(
            map(
                (response)=>Object.values(response["payload"])
                ),
            shareReplay(),
            // map(
            //     item=>{
            //         console.log('new map');
            //         return item;
            //     }
            // ), 
            // shareReplay()

        );
        
        this.beginnerCourses$ = courses$.pipe(
            map(
                (courses: Course[]) => courses.filter(
                    (course) => course.category==='BEGINNER'
                )
            )
        );

        this.advancedCourses$ = courses$.pipe(
            map(
                (courses: Course[]) => {
                    return courses.filter(course => course.category === 'Advanced');
                }
            )
        ); 


    }
}
