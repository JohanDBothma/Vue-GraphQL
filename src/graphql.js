import gql from "graphql-tag";

// repository( owner: "1-grid", name: "GitIntegration" ) {
// repository( owner: "JohanDBothma", name: "1-grid-assesment" ) {
// I would prefer to get all labels and not a set amount, but not sure how to get * labels

export const GET_ISSUES = gql`
	query {
		repository(owner: "1-grid", name: "GitIntegration") {
			id
			labels(first: 20) {
				edges {
					node {
						id
						name
					}
				}
			}
			issues(first: 100) {
				edges {
					node {
						title
						body
						state
						assignees(first: 1) {
							edges {
								node {
									login
								}
							}
						}
						labels(
							first: 20
							orderBy: { field: NAME, direction: ASC }
						) {
							edges {
								node {
									name
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const POST_ISSUE = gql`
	mutation createIssue(
		$repositoryId: ID!
		$title: String!
		$body: String!
		$labelIds: [ID!]
	) {
		createIssue(
			input: {
				repositoryId: $repositoryId
				title: $title
				body: $body
				labelIds: $labelIds
			}
		) {
			issue {
				title
				body
				state
				assignees(first: 1) {
					edges {
						node {
							login
						}
					}
				}
				labels(first: 20, orderBy: { field: NAME, direction: ASC }) {
					edges {
						node {
							name
						}
					}
				}
			}
		}
	}
`;
