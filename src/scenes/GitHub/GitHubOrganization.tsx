import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import GitHubOrganizationRepositoryList from '../../components/account/GitHubOrganizationRepositoryList';
import { RouteComponentProps } from 'react-router';
import { GitHubOrganizationQuery } from './__generated__/GitHubOrganizationQuery.graphql';

interface Props extends RouteComponentProps<{ owner: 'owner' }> {}

export default (props: Props) => {
  let organization = props.match.params.owner;
  return (
    <QueryRenderer<GitHubOrganizationQuery>
      environment={environment}
      variables={props.match.params}
      query={graphql`
        query GitHubOrganizationQuery($owner: String!) {
          githubOrganizationInfo(organization: $owner) {
            role
          }
          githubRepositories(owner: $owner) {
            ...LastDefaultBranchBuildRow_repository
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return (
          <GitHubOrganizationRepositoryList
            organization={organization}
            organizationInfo={props.githubOrganizationInfo}
            repositories={props.githubRepositories}
          />
        );
      }}
    />
  );
};
