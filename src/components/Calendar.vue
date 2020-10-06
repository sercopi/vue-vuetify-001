<template>
<v-row class="fill-height">
    <v-col>
        <v-sheet height="64">
            <v-toolbar flat>
                <v-btn color="primary" class="mr-4" @click="dialog = true" dark>New Event</v-btn>

                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
                <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">{{
            $refs.calendar.title
          }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                            <span>{{ typeToLabel[type] }}</span>
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="type = 'day'">
                            <v-list-item-title>Day</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                            <v-list-item-title>Week</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                            <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = '4day'">
                            <v-list-item-title>4 days</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>
        </v-sheet>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-container>
                    <v-form @submit.prevent="addEvent">
                        <v-text-field v-model="name" type="text" label="event name (required)"></v-text-field>
                        <!--                         <v-text-field v-model="details" type="text" label="detail"></v-text-field>

 -->
                        <ckeditor :editor="editor.editor" v-model="details" :config="editor.editorConfig"></ckeditor>

                        <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
                        <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
                        <v-text-field v-model="timeStart" type="time" label="time start"></v-text-field>
                        <v-text-field v-model="timeStop" type="time" label="time end"></v-text-field>
                        <v-text-field v-model="color" type="color" label="color (click to open color menu)"></v-text-field>
                        <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">Create Event</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>
        <v-sheet height="600">
            <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"></v-calendar>
            <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <form v-if="currentlyEditing !== selectedEvent.id">
                            <div v-html="selectedEvent.details"></div>
                        </form>
                        <form v-else action>
                            <v-text-field v-model="selectedEvent.name" type="text" label="event name (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.start" :max="selectedEvent.stop" type="date" label="start (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.end" :min="selectedEvent.start" type="date" label="end (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.timeStart" type="time" label="time start"></v-text-field>
                            <v-text-field v-model="selectedEvent.timeStop" type="time" label="time end"></v-text-field>
                            <v-text-field v-model="selectedEvent.color" type="color" label="color (click to open color menu)"></v-text-field>
                            <!--                             <textarea-autosize v-model="selectedEvent.details" type="text" style="width.100%" :min-height="100" placeholder="add note"></textarea-autosize>
 -->
                            <ckeditor :editor="editor.editor" v-model="selectedEvent.details" :config="editor.editorConfig"></ckeditor>
                        </form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
                        <v-btn text v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">Edit</v-btn>
                        <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-sheet>
    </v-col>
</v-row>
</template>

<script>
import {
    db
} from '@/main.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue';
export default {
    components: {
        ckeditor: CKEditor.component
    },
    data() {
        return {
            editor: {
                editor: ClassicEditor,
                editorConfig: {
                    height: '250px',
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'link',
                            '|',
                            'insertTable',
                            '|',
                            'undo',
                            'redo'
                        ]
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    language: 'es'
                }
            },
            today: new Date().toISOString().substr(0, 10),
            focus: new Date().toISOString().substr(0, 10),
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 days'
            },
            name: null,
            details: null,
            start: null,
            end: null,
            color: '#1976D2',
            currentlyEditing: null,
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            timeStart: '',
            timeStop: '',
            events: [],
            dialog: false
        };
    },
    mounted() {
        this.getEvents();
    },
    methods: {
        editEvent(event) {
            this.currentlyEditing = event.id;
        },
        async addEvent() {
            if (!this.name || !this.start || !this.end) {
                alert('please fill all required parameters for the event');
                return false;
            }
            if (
                this.timeStart &&
                this.timeStop &&
                new Date(this.start + 'T' + this.timeStart).getTime() >
                new Date(this.end + 'T' + this.timeStop).getTime()
            ) {
                alert('end time cannot be earlier than than start');
                return false;
            }

            if (this.timeStart && !this.timeStop) {
                this.timeStop = '24:00';
            }
            if (this.timeStop && !this.timeStart) {
                this.timeStart = '00:00';
            }
            await db.collection('calEvent').add({
                name: this.name,
                details: this.details,
                color: this.color,
                start: this.start + (this.timeStart ? 'T' + this.timeStart : ''),
                end: this.end + (this.timeStop ? 'T' + this.timeStop : ''),
                timeStart: this.timeStart,
                timeStop: this.timeStop
            });
            this.getEvents();
            this.name = '';
            this.details = '';
            this.color = '#1976D2';
            this.start = '';
            this.end = '';
            this.timeStart = null;
            this.timeStop = null;
        },
        async updateEvent(event) {
            if (!event.name || !event.start || !event.end) {
                alert('please fill all required parameters for the event');
                return false;
            }
            if (
                event.timeStart &&
                event.timeStop &&
                new Date(event.start.substr(0, 10) + 'T' + event.timeStart).getTime() >
                new Date(event.end.substr(0, 10) + 'T' + event.timeStop).getTime()
            ) {
                alert('end time cannot be earlier than than start');
                return false;
            }
            if (event.timeStart && !event.timeStop) {
                event.timeStop = '24:00';
            }
            if (event.timeStop && !event.timeStart) {
                event.timeStart = '00:00';
            }
            await db
                .collection('calEvent')
                .doc(this.currentlyEditing)
                .update({
                    ...event,
                    start: event.start.substr(0, 10) +
                        (event.timeStart ? 'T' + event.timeStart : ''),
                    end: event.end.substr(0, 10) +
                        (event.timeStop ? 'T' + event.timeStop : '')
                });
            this.getEvents();
            this.selectedOpen = false;
            this.currentlyEditing = null;
        },
        async getEvents() {
            const snapshot = await db.collection('calEvent').get();
            let events = [];

            snapshot.forEach(doc =>
                events.push({
                    ...doc.data(),
                    start: doc.data().start,
                    end: doc.data().end,
                    id: doc.id
                })
            );
            this.events = events;
            console.log(this.events);
        },
        async deleteEvent(event) {
            db.collection('calEvent')
                .doc(event)
                .delete();
            this.selectedOpen = false;
            this.getEvents();
        },
        getEventColor(ev) {
            return ev.color;
        },
        viewDay({
            date
        }) {
            this.focus = date;
            this.type = 'day';
        },
        setToday() {
            this.focus = '';
        },
        prev() {
            this.$refs.calendar.prev();
        },
        next() {
            this.$refs.calendar.next();
        },
        showEvent({
            nativeEvent,
            event
        }) {
            const open = () => {
                this.selectedEvent = event;
                this.selectedElement = nativeEvent.target;
                setTimeout(() => {
                    this.selectedOpen = true;
                }, 10);
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                setTimeout(open, 10);
            } else {
                open();
            }

            nativeEvent.stopPropagation();
        }
    }
};
</script>
