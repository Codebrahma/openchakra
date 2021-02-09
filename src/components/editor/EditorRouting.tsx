import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Editor from './Editor'
import UserComponentsPreview from './UserComponentsPreview'
import CustomPageEditor from './CustomPageEditor'

const EditorRouting: React.FC = () => {
  return (
    <Switch>
      <Route path="/app" strict>
        <Editor />
      </Route>

      <Route path="/customPage/component" strict>
        <CustomPageEditor />
      </Route>

      <Route path="/customPage" strict>
        <UserComponentsPreview />
      </Route>
      <Route path="/" strict>
        <Editor />
      </Route>
    </Switch>
  )
}

export default EditorRouting
