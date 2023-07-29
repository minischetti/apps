import React from 'react'
import Calendar from './components/Calendar'
import Side from './components/Side'
import mockEvents from '../data/events.json'
import mockTasks from '../data/tasks.json'
import mockNotes from '../data/notes.json'

type Item = {
  name: string
  description: string
  date: Date
}

interface Event extends Item {
  priority: Priority
  status: Status
}

type Priority = {
  name: string
  color: string
}

enum StatusValues {
  'To Do',
  'In Progress',
  'Done',
}

enum PriorityValues {
  'Low',
  'Medium',
  'High',
}

type Status = {
  name: string
  color: string
}

interface Task extends Item {
  name: string
  description: string
  date: Date
  priority: PriorityValues
  status: StatusValues
}

interface Note extends Item {
}

function App() {
  const [events, setEvents] = React.useState(mockEvents as Event[])
  const [tasks, setTasks] = React.useState([] as Task[])
  const [notes, setNotes] = React.useState([] as Note[])
  return (
    <div className="flex gap-10 h-screen">
      <Side />
      <Calendar events={events}/>
    </div>
  )
}

export default App
