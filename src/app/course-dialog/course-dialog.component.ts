import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {Observable, fromEvent} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    formChanged$ : Observable<any>

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {

       this.form.valueChanges.pipe(
        tap(
            console.log
        ),
        debounceTime(1000),
        distinctUntilChanged(),
        concatMap(
            changes => this.putRequest()
        ),
       ).subscribe(
        
       )



    }



    ngAfterViewInit() {


    }

    
    putRequest(){
        return  fromPromise(
            fetch(`http://localhost:9000/api/courses/${this.course.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(this.form.value)
        })
        )
    }


    close() {
        this.dialogRef.close();
    }

  save() {

  }
}
