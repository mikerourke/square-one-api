/* @flow */

export default function defineSetting(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  return sequelize.define('Setting', {
    category: DataTypes.STRING,
    settingName: DataTypes.STRING,
    data: DataTypes.JSONB,
  }, {
    tableName: 'settings',
    freezeTableName: true,
    timestamps: false,
    hooks: {
      /**
       * Add the representatives from the users table to the end of
       *    the list as a setting.
       * @param {Array} results Results of the find method.
       */
      afterFind: results => new Promise((resolve, reject) => {
        sequelize.model('User')
          .findAll({ where: { title: 'Representative' } })
          .then((users) => {
            const representatives = users.map(user => user.fullName);
            results.push({
              id: 999, // Arbitrary value to prevent ID collision.
              category: 'lists',
              settingName: 'representatives',
              data: representatives,
            });
            resolve();
          })
          .catch(error => reject(new Error(error)));
      }),
    },
    indexes: [
      {
        unique: true,
        fields: ['settingName'],
      },
    ],
  });
}
