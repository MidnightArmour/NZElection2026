# Model notes

- Current support uses the latest poll from each pollster, fieldwork midpoints, recency and sample-size weights.
- Pollster offsets are current-cycle deviations shrunk 75% toward zero and capped at 0.75 percentage points; these are not historical house effects.
- Current-support uncertainty depends partly on recent poll disagreement.
- Election-day error is a separate heavy-tailed national and bloc layer. Scale choices remain modelling assumptions because no full historical calibration was undertaken.
- Party votes are generated compositionally in log space and sum to 99%, reserving 1% for other parties.
- Electorate swing uses each simulation’s realised national two-bloc vote. General and Māori electorates use separate sensitivities and shared error pools.
- Candidate adjustments are blended with raw transposed shares using an evidence hierarchy.

## Māori electorate update

- All seven Māori electorates use published Whakaata Māori–Curia candidate polling as the dominant baseline.
- The Te Pāti Māori strategy is represented as a candidate-vote premium alongside Labour/Green party-vote strength, not as a reciprocal Labour concession.
- Tāmaki Makaurau models Kerrin Leoni as a local independent/other candidate following withdrawal of Labour endorsement.
- Te Tai Tokerau and Te Tai Tonga include local breakaway/independent support.
- Local candidates can win a seat and are counted inside the base 120-seat Parliament; they do not receive party-list seats.

## Māori electorate poll calibration

- Te Tai Tokerau poll weight is reduced to 62% because the lead is narrow, 22% were undecided, and a Green Māori-electorate victory would be unprecedented. Green remains a plausible leader, but the model retains more historical baseline influence and wider uncertainty.
- Tāmaki Makaurau poll weight is reduced to 64% and uncertainty is widened because the poll preceded withdrawal of Labour endorsement from Kerrin Leoni.
- Te Tai Tonga also receives wider uncertainty because four candidates had material support.
- Published undecided shares are not mechanically allocated. They widen the seat-level probability distribution instead.
- Labour is not given a general Māori-seat withdrawal penalty. Poll-led Labour advantages in Ikaroa-Rāwhiti and Te Tai Tonga remain, while Te Pāti Māori retains a smaller one-way candidate-vote premium.

## General-electorate evidence coverage

- No complete, verified general-electorate polling series is bundled with the model. General seats therefore remain grounded in transposed 2023 candidate results, candidate adjustments and the simulated national result.
- The absence of local polls is represented by an 8% increase in residual seat uncertainty. The model does not create local poll overrides from commentary or from a single unverified figure.
- If a general-electorate poll is added later, it should be stored with poll count, fieldwork, sample, undecided share and post-fieldwork candidate changes. One poll must be blended with the historical baseline and cannot receive more than 65% weight without corroboration.
- The 2026 strategic-voting profiles now represent only incremental behaviour above the substantial split voting already embedded in the 2023 candidate-vote baseline.
- National party-vote losses to ACT and NZ First retain more National electorate support than losses across the bloc; Opportunity losses receive intermediate retention.
