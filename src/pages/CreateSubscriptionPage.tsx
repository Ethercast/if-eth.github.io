import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Header, Message } from 'semantic-ui-react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import Dimmer from 'semantic-ui-react/dist/commonjs/modules/Dimmer/Dimmer';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import * as _ from 'underscore';
import FormattedJSON from '../components/FormattedJSON';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';
import { EthercastTypes } from '@ethercast/model';
import { createSubscription, getExamples } from '../util/api';
import mustBeLoggedIn from '../util/mustBeLoggedIn';

interface CreateSubscriptionPageState {
  subscription: Partial<EthercastTypes.CreateTransactionSubscriptionRequest | EthercastTypes.CreateLogSubscriptionRequest>;
  error: Error | null;
  promise: Promise<any> | null;
  example: any;
}

export function parseSubscriptionFilters(subscription: any): EthercastTypes.Subscription {
  return {
    ...subscription,
    filters: _.mapObject(
      subscription.filters,
      (value: string) => typeof value === 'string' && value.length > 0 ?
        value.split(',') :
        null
    )
  };
}

export default mustBeLoggedIn(
  class CreateSubscriptionPage extends React.Component<RouteComponentProps<{}>, CreateSubscriptionPageState> {
    createSubscription = () => {
      this.setState({
        promise: createSubscription(parseSubscriptionFilters(this.state.subscription))
          .then(
            (subscription) => {
              this.props.history.push(`/subscriptions/${subscription.id}`);
            }
          )
          .catch(
            (error: any) => {
              this.setState({ error, promise: null });
            }
          )
      });
    };

    state = {
      subscription: {
        type: 'log',
        filters: {}
      } as any,
      promise: null,
      error: null,
      example: null
    };

    removeMessage = () => this.setState({ error: null });

    handleViewExample = async () => {
      const parsed = _.pick(parseSubscriptionFilters(this.state.subscription), 'type', 'filters');

      try {
        const promise = getExamples(parsed as any);
        this.setState({ promise });
        const example = await promise;
        this.setState({ example, promise: null });
      } catch (err) {
        this.setState({ promise: null });
        alert(`Sorry, your subscription is not valid.\n\n${err.message}`);
      }
    };

    closeExample = () => {
      this.setState({ example: null });
    };

    render() {
      const { subscription, error, promise, example } = this.state;

      return (
        <Container>
          <Dimmer.Dimmable>
            <Dimmer active={!!promise} inverted>
              <Loader active={!!promise}/>
            </Dimmer>

            <Header as="h1">Create subscription</Header>
            <SubscriptionForm
              onViewExample={this.handleViewExample}
              value={subscription as any}
              onChange={subscription => this.setState({ subscription })}
              onSubmit={this.createSubscription}
            />
          </Dimmer.Dimmable>

          <Modal open={example !== null} onClose={this.closeExample} animated>
            <Modal.Header>
              Example event
            </Modal.Header>
            <Modal.Content scrolling>
              <Message warning>
                <Message.Header>Work in progress</Message.Header>
                <Message.Content>
                  This feature is a work in progress. The log you actually receive may include additional decoded log or
                  transaction information under the key <code>ethercast</code>. Try adding addresses to your subscription
                  filters to see a better example.
                </Message.Content>
              </Message>
              {example ? <FormattedJSON object={example}/> : null}
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeExample}>
                Done
              </Button>
            </Modal.Actions>
          </Modal>

          {
            error !== null ? (
                <Message negative onDismiss={this.removeMessage}>
                  {(error as any).message}
                </Message>
              ) :
              null
          }
        </Container>
      );
    }
  }
);
