import rp from 'request-promise';

import Logger from '../utils/Logger';
import GoPipelineParser from '../utils/GoPipelineParser';
import Util from '../utils/Util';

export default class GoBuildService {

  constructor(goConfig) {
    this.conf = goConfig;
  }

  /**
   * @returns {Promise<Array<string>>} All available pipelines from the go.cd server
   */
  getAllPipelines() {
    const options = Util.createRequestOptions(`${this.conf.serverUrl}/go/api/pipelines.xml`, this.conf);

    return rp(options)
      .then((res) => {
        // Parse response xml
        return GoPipelineParser.parsePipelineNames(res).then((pipelineNames) => {
          return pipelineNames;
        }, (error) => {
          Logger.error('Failed to parse pipelines.xml');
          throw error;
        });
      }).catch((err) => {
        Logger.error('Failed to retrieve pipeline names');
        throw err
      });
  }

  /**
   * @param   {string}          name  Name of the pipeline
   * @returns {Promise<Object>}       Pipeline instance. 
   * Example 
   * {
   *    name : 'id,
   *    buildtime : 1457085089646,
   *    author: 'Bobby Malone',
   *    counter: 255,
   *    paused: false,
   *    health: 2,
   *    stageresults: [
   *      {
   *        name: 'Build',
   *        status: 'passed',
   *        jobresults: [{
   *          name: 'build-job',
   *          result: 'passed',
   *          schedueld: 1457085089646
   *        }]
   *      },
   *      {
   *        name: 'Test',
   *        status: 'building'
   *        jobresults: []
   *      }] 
   * }
   */
  getPipelineHistory(name) {
    const options = Util.createRequestOptions(`${this.conf.serverUrl}/go/api/pipelines/${name}/history/0`, this.conf, true);

    return rp(options)
      .then(res => GoPipelineParser.parsePipelineResult(res.pipelines.slice(0, 5)))
      .catch((err) => {
        Logger.error(`Failed to get pipeline history for pipeline "${name}" returning last result, ${err.statusCode}: ${err.message}`);
        return this.pipelines ? this.pipelines.filter((p) => p && p.name === name)[0] : null;
      });
  }

}
