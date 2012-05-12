Travis.Commit = Travis.Model.extend(Travis.Helpers, {
  sha:     DS.attr('string'),
  branch:  DS.attr('string'),
  message: DS.attr('string'),

  build: DS.belongsTo('Travis.Build'),
});
