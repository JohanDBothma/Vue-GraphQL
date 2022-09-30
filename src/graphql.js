import gql from "graphql-tag";

// This is the main graphql query file. We just have two consts here for the getquery and mutation

// as mentioned in the readme, as I couldn't get the OAuth to work
// I switch between these two repositories, depending if I want to write or only read

// personal - for read and write
// repository( owner: "JohanDBothma", name: "1-grid-assesment" ) {

// 1grid - for only reading
// repository( owner: "1-grid", name: "GitIntegration" ) {

// I would prefer to get all labels and not a set amount, but not sure how to get * labels
export const GET_ISSUES = gql`
	query {
		repository(owner: "JohanDBothma", name: "1-grid-assesment") {
			id
			labels(first: 50) {
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
