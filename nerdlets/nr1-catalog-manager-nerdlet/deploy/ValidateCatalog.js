import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Spinner, StackItem, Stack, Button, Icon } from 'nr1';

import ErrorMessage from '../graphql/ErrorMessage';
// import { client } from '../graphql/ApolloClientInstance';
import {
  // CATALOG_VALIDATION_QUERY
  // VALIDATION_QUERY,
  CATALOG_VALIDATION_QUERY,
  EXPRESSIONS
} from '../graphql/Queries';

import { CONFIG_JSON_LENGTH_REQUIREMENTS } from './configJsonRequirements.js';

export default class ValidateCatalog extends PureComponent {
  static propTypes = {
    version: PropTypes.string,
    repoName: PropTypes.string,
    triggerWorkflowDispatch: PropTypes.func,
    closeModal: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      dimensions: []
      // validated: false
    };
  }

  // _filterCatalogApps(search) {
  //   return {
  //     ...search,
  //     nodes: search.nodes.filter(n => n.catalog)
  //   };
  // }

  onImgLoad = ({ target: img }) => {
    // console.log('img:', img);
    // console.log({
    //   dimensions: { height: img.naturalHeight, width: img.naturalWidth }
    // });
    this.setState(prevState => ({
      dimensions: [
        ...prevState.dimensions,
        { name: img.id, height: img.naturalHeight, width: img.naturalWidth }
      ]
    }));
  };

  loadImages(repository) {
    const { repoName, version } = this.props;

    return repository.screenshots.entries.map((image, i) => {
      return (
        <img
          id={image.name}
          className="project-screenshot-list-item"
          key={i}
          onLoad={this.onImgLoad}
          src={`https://raw.githubusercontent.com/newrelic/${repoName}/${version}/catalog/screenshots/${image.name}`}
        />
      );
    });
  }

  validateImageDimensions() {
    const { dimensions } = this.state;
    const results = dimensions.map(d =>
      this.checkDimensions(d.name, d.width, d.height)
    );

    // Fail fast
    if (results.length === 0) {
      return {
        imageRenderer: () => {
          return (
            <div className="validation-container">
              <div className="item-symbol">{this.setSymbol('ERROR')}</div>
              <div className="item-title">
                <code>No screenshots found. Must have at least one.</code>
              </div>
            </div>
          );
        },
        imageValidationResult: false
      };
    }

    return {
      imageRenderer: () => {
        return results.length > 0
          ? results.map((r, i) => {
              return (
                <div key={i} className="validation-container">
                  <div className="item-symbol">{r.symbol}</div>
                  <div className="item-title">
                    <code>{r.name}</code>
                  </div>
                </div>
              );
            })
          : '';
      },
      // return dimensions.length > 0
      //   ? dimensions.map((dim, i) => {
      //       return (
      //         <div key={i} className="validation-container">
      //           <div className="item-symbol">
      //             {this.checkDimensions(dim.width, dim.height)}
      //           </div>
      //           <div className="item-title">
      //             <code>{dim.name}</code>
      //           </div>
      //         </div>
      //       );
      //     })
      //   : '';
      // },
      imageValidationResult:
        results.filter(r => r.status === 'ERROR').length === 0
    };
  }

  checkDimensions(name, width, height) {
    const aspectRatio = Math.trunc((width / height) * 10);
    // console.log(name, aspectRatio, width, height);

    const check = aspectRatio >= 13 && aspectRatio <= 17 ? 'SUCCESS' : 'ERROR';
    return {
      symbol: this.setSymbol(check),
      status: check,
      name,
      width,
      height
    };
  }

  setSymbol(check) {
    switch (check) {
      case 'SUCCESS':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#3ca653"
            type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK__V_ALTERNATE}
          />
        );
      case 'ERROR':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#9C5400"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_WARNING
            }
          />
        );
      // case 'major':
      //   return (
      //     <Icon
      //       className="timeline-item-symbol-icon"
      //       color="#BF0016"
      //       type={
      //         Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR
      //       }
      //     />
      //   );
      // case 'critical':
      //   return (
      //     <Icon
      //       className="timeline-item-symbol-icon"
      //       color="#ffffff"
      //       type={
      //         Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_DISABLED
      //       }
      //     />
      //   );
    }
  }

  /**
   * Should check all fields in config.json - only does length checks at the moment
   * @return "SUCCESS" if all rules pass, otherwise "ERROR"
   */
  processConfigJsonRules(configJson) {
    // const tagline =
    //   configJson.tagline &&
    //   configJson.tagline < CONFIG_JSON_LENGTH_REQUIREMENTS.tagline
    //     ? 'SUCCESS'
    //     : 'ERROR';

    // const repository =
    //   configJson.repository &&
    //   configJson.repository < CONFIG_JSON_LENGTH_REQUIREMENTS.repository
    //     ? 'SUCCESS'
    //     : 'ERROR';
    // const details =
    //   configJson.details &&
    //   configJson.details < CONFIG_JSON_LENGTH_REQUIREMENTS.details
    //     ? 'SUCCESS'
    //     : 'ERROR';
    // const whatsNew =
    //   configJson.whatsNew &&
    //   configJson.whatsNew < CONFIG_JSON_LENGTH_REQUIREMENTS.whatsNew
    //     ? 'SUCCESS'
    //     : 'ERROR';

    return Object.keys(CONFIG_JSON_LENGTH_REQUIREMENTS)
      .map(key => {
        const rule = CONFIG_JSON_LENGTH_REQUIREMENTS[key];
        const val = configJson[key];

        return {
          key: key,
          status: val && val.length <= rule ? 'SUCCESS' : 'ERROR'
        };
      })
      .filter(r => r.status === 'ERROR').length === 0
      ? 'SUCCESS'
      : 'ERROR';
  }

  validateConfigJson(repository) {
    // const test = {
    //   configJson: null
    // }
    const text = repository?.configJson?.text;
    // console.log('text', text);

    // Fail fast if there's nothing we can check
    if (!text) {
      return {
        configRenderer: () => {
          return (
            <div className="validation-container">
              <div className="item-symbol">{this.setSymbol('ERROR')}</div>
              <div className="item-title">
                <code>catalog/config.json</code>
              </div>
            </div>
          );
        },
        configValidationResult: false
      };
    }

    // const results = [];

    const configJson = JSON.parse(text);
    // console.log('configJson', configJson);

    // Object.keys(configJson).map(key => {
    //   return results.push({ key: key, value: 'success', state: 'SUCCESS' });
    //   // value: configJson[key] });
    // });

    // processRules
    const rulesResult = this.processConfigJsonRules(configJson);

    // Object.keys(CONFIG_JSON_LENGTH_REQUIREMENTS).map(key => {
    //   const rule = CONFIG_JSON_LENGTH_REQUIREMENTS[key];
    //   const v = configJson[key];

    //   const result = v ? (v <= rule ? 'SUCCESS' : 'ERROR') : 'ERROR';
    //   return {
    //     key: key,
    //     result: v ? (v < rule ? 'SUCCESS' : 'ERROR') : 'ERROR'
    //   };
    // });

    return {
      configRenderer: () => {
        return (
          <div className="validation-container">
            <div className="item-symbol">{this.setSymbol(rulesResult)}</div>
            <div className="item-title">
              <code>catalog/config.json</code>
            </div>
          </div>
        );
      },
      configValidationResult: rulesResult === 'SUCCESS'
    };
    // <div>
    //   <p>
    //     <code>catalog/config.json</code>
    //   </p>
    //   <div>
    //     {results.map((r, i) => (
    //       <p key={i}>
    //         {r.key}
    //         <Icon
    //           type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK__V_ALTERNATE}
    //           color="#3ca653"
    //         />
    //         ;
    //       </p>
    //     ))}
    //   </div>
    // </div>
  }

  // checkConfigJson(rulesResult) {
  //   // const check = 'SUCCESS';
  //   return this.setSymbol(rulesResult);
  // }

  validateAndRenderResults(repository) {
    // const imageDimResults = validateImageDimensions()
    // renderImageCheckResult()

    // const configJsonResult = validateConfigJson()
    // renderConfigJsonResult()
    const {
      imageRenderer,
      imageValidationResult
    } = this.validateImageDimensions();
    const { configRenderer, configValidationResult } = this.validateConfigJson(
      repository
    );

    const success = imageValidationResult && configValidationResult;

    return (
      <>
        {/* <div>{this.validateImageDimensions()}</div> */}

        <div>{configRenderer()}</div>
        <div>{imageRenderer()}</div>
        <div>{this.renderWorkflowDispatchSubmission(success)}</div>
      </>
    );
  }

  renderWorkflowDispatchSubmission(success) {
    // const { repo } = this.props;
    // const { validated } = this.state;
    return (
      <StackItem grow style={{ width: '100%', marginTop: '16px' }}>
        {/* <h2>Trigger Workflow Dispatch</h2> */}
        {!success && (
          <p>Errors must be addressed before deployment can occur.</p>
        )}

        {/* <form onSubmit={this.props.triggerWorkflowDispatch}> */}
        {/* <Stack fullWidth verticalType={Stack.VERTICAL_TYPE.BOTTOM}> */}
        {/* <StackItem grow> */}
        <Button type={Button.TYPE.Secondary} onClick={this.props.closeModal}>
          Cancel
        </Button>
        <Button
          type={Button.TYPE.PRIMARY}
          onClick={this.props.triggerWorkflowDispatch}
          disabled={!success}
        >
          Submit for Review
        </Button>
        {/* </StackItem> */}
        {/* </Stack> */}
        {/* </form> */}
      </StackItem>
    );
  }

  render() {
    // const { isSetup, userToken } = this.props;
    const { version, repoName } = this.props;

    // const { dimensions } = this.state;
    const { configExp, documentationExp, screenshotsExp } = EXPRESSIONS(
      version
    );

    // const apClient = client(userToken);

    // if (!isSetup) {
    //   return <></>;
    // }

    return (
      // <ApolloProvider client={apClient}>
      // <Query query={VALIDATION_QUERY}>
      // <Query query={CATALOG_VALIDATION_QUERY} variables={{ repoName }}>
      <Query
        query={CATALOG_VALIDATION_QUERY}
        variables={{ repoName, configExp, documentationExp, screenshotsExp }}
        // variables={{ repoName }}
      >
        {({ data, loading, error }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }
          const { repository } = data;
          // console.log('result: ', repository);

          if (loading || !repository) {
            return <Spinner fillContainer />;
          }

          // console.log('Result: ', repository);

          return (
            <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL} fullWidth>
              <StackItem grow className="validation">
                <p className="validation-header">Validation Results</p>
                <div
                  className="project-screenshot-list"
                  style={{ display: 'none' }}
                >
                  {this.loadImages(repository)}
                </div>
                {/* <div>{this.validateImageDimensions()}</div>

                <div>{this.validateConfigJson(repository)}</div> */}

                <div>{this.validateAndRenderResults(repository)}</div>
              </StackItem>
              {/* {this.renderWorkflowDispatchSubmission()} */}
            </Stack>
          );
        }}
      </Query>
      // </ApolloProvider>
    );
  }
}
