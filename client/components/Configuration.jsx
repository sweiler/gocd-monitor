/**
 * Configuration dialog
 */

import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import RegexPipelineFilter from './RegexPipelineFilter';
import { Radio, ListItemText } from '../../node_modules/@material-ui/core';

export default class Configuration extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      // Sort filterable pipelines names
      pipelines: this.setupPipelines(props.pipelines, props.disabledPipelines),
      // Configurable sort order
      currentSortOrder: props.sortOrder,
      // List of sort order options openened or not
      sortOrderListOpened: false,
      filterRegexProps: props.filterRegexProps
    };
  }

  componentDidMount() {
    this.setState({
      pipelines: this.setupPipelines(this.props.pipelines, this.props.disabledPipelines)
    });
  }


  // Setup and sort pipelines by name
  setupPipelines(pipelines, disabledPipelines) {
    return pipelines
      .map((p) => {
        return {name: p, active: disabledPipelines.indexOf(p) < 0}
      })
      .sort((a, b) => a.name > b.name ? 1 : -1);
  }

  // Toggles a pipeline on/off
  togglePipeline(p, event) {
    this.props.onTogglePipeline(p.name, event.target.checked);
  }

  // Sort order changed
  sortOrderChanged(sortOrder) {
    this.setState({
      currentSortOrder: sortOrder,
      sortOrderListOpened: false
    });
    this.props.onSortOrderChange(sortOrder);
  }

  openSortOrderList(e) {
    this.setState({
      sortOrderListOpened: true,
      anchorEl: e.target
    });
  }

  closeSortOrderList() {
    this.setState({
      sortOrderListOpened: false
    });
  }

  updateFilterRegexProps() {
    this.props.onFilterRegexPropsChange({
      active: this.state.filterRegexActive,
      value: this.state.filterRegex
    })
  }

  updateFilterRegex(e) {
    this.setState({
      filterRegex: e.target.value
    });
  }

  updateFilterRegexActive(e) {
    this.setState({
      filterRegexActive: e.target.checked
    });
  }

  render() {

    let pipelines =
      (
        <List>
          <ListSubheader>Toggle Pipelines</ListSubheader>

          {this.state.pipelines.map((p) => {
            return (
              <ListItem key={p.name}>
                <ListItemText primary={p.name} />
                <ListItemSecondaryAction>
                  <Switch defaultChecked={p.active} color="primary" onChange={this.togglePipeline.bind(this, p)} />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      );

    return (
      <div>
        <List>
          <ListSubheader>Sort Order</ListSubheader>
            {
            this.props.sortOrders.map((s) => 
                (
                  <ListItem key={s.name} onClick={this.sortOrderChanged.bind(this, s)}>
                    <Radio
                      color="primary"
                      checked={this.state.currentSortOrder === s}
                      tabIndex={-1}
                    />
                    <ListItemText primary={s.label} />
                  </ListItem>
                )
            )
          }
          <Divider />
        </List>
        <RegexPipelineFilter filterRegexProps={this.state.filterRegexProps} onFilterRegexPropsChange={this.props.onFilterRegexPropsChange}/>
        {pipelines}
      </div>
    );
  }
}
