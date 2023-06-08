<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import Likert from './components/Likert.vue'

import { DB, Record } from './db'

import type { Ref } from 'vue'
import type { IRecord } from './db';

interface IEvaluation {
    id: string;
    records: IRecord[];
}

const LS_NAME = 'emirror-lct-eval';


const results: IRecord[] = [];

const index = ref( -1 );
const record: Ref<IRecord | null> = ref( null );
const debugMessages: Ref<string[]> = ref( [] );

const hasDebugMessages = computed( () => !!debugMessages.value.length );
const hasStart = computed( () => index.value < 0 );
const hasImage = computed( () => !!record.value );
const hasDone = computed( () => index.value == DB.length );

function onStart() {
    index.value = 0;
    record.value = DB[index.value];
}

function onQuestionnaireAnswer(e: number) {
    if (record.value) {
        const r = record.value;
        Object.assign(r, { amswer: e });
        results.push(r);
    }

    if (++index.value < DB.length) {
        record.value = DB[index.value];
    }
    else {
        record.value = null;
        saveResults();
    }
}

function imageURL() {
    if (record.value) {
        const name = Record.makeImageName(record.value)
        return `./images/${name}.jpg`;
    }
}

function saveResults() {
    saveToFile([results.join('\r\n')]);
    saveToLocalStorage(results);
}

function saveToFile(data: string[]) {
    var file = new Blob(data, {type: 'text/plain'});

    let savedDataString = localStorage.getItem(LS_NAME);
    const savedData: IEvaluation[] = savedDataString ? JSON.parse(savedDataString) : [];

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = 'p' + savedData.length;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode?.removeChild(link);
    }, 0);
}

function saveToLocalStorage(records: IRecord[]) {
    let savedDataString = localStorage.getItem(LS_NAME);
    const savedData: IEvaluation[] = savedDataString ? JSON.parse(savedDataString) : [];
    console.dir(savedDataString);
    
    savedData.push({
        id: 'p' + savedData.length,
        records,
    });

    savedDataString = JSON.stringify(savedData);
    localStorage.setItem(LS_NAME, savedDataString);
}

onMounted(() => {
    window.addEventListener( 'error' , (e) => { debugMessages.value.push( `ERROR: ${e.message}` )})
    window.addEventListener( 'keydown', (e) => {
        if (e.key == 'q') {
        }
    });
});

</script>

<template lang="pug">
main
    button.start.is-centered(v-show="hasStart"
        @click="onStart") Start

    .evaluation-container(v-if="hasImage")
        .target-container
            img.target(:src="imageURL()")

        Likert(:count="5"
            title="How safe it is to change the lane?"
            @value="onQuestionnaireAnswer")

    .done.is-centered(v-show="hasDone") Finished. Thank you!

    h3.debug(v-show="hasDebugMessages")
        div(v-for="err in debugMessages") {{ err }}
</template>

<style>
@import './assets/base.css';
#app {
    margin: 0 1em;
    padding: 0 2rem;
    overflow: hidden;
    font-weight: normal;
}

.is-centered {
    position: fixed;
    left: 25vw;
    top: 25vh;
    width: 50vw;
    height: 50vh;
}

.start {
    font-size: 3.75rem;
    border-radius: 1rem;
    font-family: inherit;
}

.evaluation-container {
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
}

.target-container {
    display: flex;
    height: 360px;
}

.target {
    margin: auto;
    min-height: 260px;
}

.done {
    font-size: 3.75rem;
    line-height: 50vh;
    text-align: center;
}

.debug {
    position: fixed;
    left: 1em;
    right: 1em;
    bottom: -0.25em;
    padding: 0.5em 1em;
    text-align: center;

    background-color: var(--color-background-mute);
    border-radius: 0.25em;
    border: rgb(204, 122, 0) 2px solid;
}

</style>
