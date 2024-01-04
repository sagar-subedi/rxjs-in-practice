import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, of } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../util/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    courseId = this.route.snapshot.params['id'];


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
        this.course$ = createHttpObservable(`http://localhost:9000/api/courses/${this.courseId}`);

        this.lessons$ = this.loadLessons('');

        fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            map(
                event => event.target.value
            ),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(
                (search) => this.loadLessons(search)
            )

        ).subscribe(() => {

        }
        )

    }

    loadLessons(search = '') {
        const lessons$ = createHttpObservable(`http://localhost:9000/api/lessons/?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(
                response => response["payload"]
            )
        );
        this.lessons$ = lessons$;
        return lessons$;
    }

    ngAfterViewInit() {




    }




}
