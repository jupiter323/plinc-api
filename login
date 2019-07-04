#!/bin/bash

[[ ! $1 ]] && { echo "Missing clientid" >&2; exit 1; }
[[ ! $2 ]] && { echo "Missing username" >&2; exit 1; }
[[ ! $3 ]] && { echo "Missing password" >&2; exit 1; }

clientid="$1"
username="$2"
password="$3"

AUTH_CHALLENGE_SESSION=`aws cognito-idp initiate-auth \
   --auth-flow USER_PASSWORD_AUTH \
   --client-id $clientid \
   --auth-parameters "USERNAME=$username,PASSWORD=$password" \
   --query "Session" \
   --output text`

read -p "MFA Code :- " -r
echo
if [[ $REPLY =~ ^.*$ ]]
then
    AUTH_TOKEN=`aws cognito-idp respond-to-auth-challenge \
        --client-id $clientid \
        --challenge-name SMS_MFA \
        --challenge-responses "SMS_MFA_CODE=$REPLY,USERNAME=$username" \
        --session $AUTH_CHALLENGE_SESSION \
        --query "AuthenticationResult.IdToken" \
        --output text`
fi

echo AUTH TOKEN:
echo $AUTH_TOKEN

exit 0
