# Model notes

- Current support uses the latest poll from each pollster, fieldwork midpoints, recency and sample-size weights.
- Pollster offsets are current-cycle deviations shrunk 75% toward zero and capped at 0.75 percentage points; these are not historical house effects.
- Current-support uncertainty depends partly on recent poll disagreement.
- Election-day error is a separate heavy-tailed national and bloc layer. Scale choices remain modelling assumptions because no full historical calibration was undertaken.
- Party votes are generated compositionally in log space and sum to 99%, reserving 1% for other parties.
- Electorate swing uses each simulation’s realised national two-bloc vote. General and Māori electorates use separate sensitivities and shared error pools.
- Candidate adjustments are blended with raw transposed shares using an evidence hierarchy.
