import db from '../dbPromiseConnect'

const getSearch = (params) => {
    return new Promise((resolve, reject) => {
        db.get().then( connection => {
            let part = '';
            if (params.sex.localeCompare('male') === 0 || params.sex.localeCompare('female') === 0)
            {
                if (params.orientation.localeCompare('gay') === 0)
                    part = `AND orientation IN ('gay', 'bisexual') AND sex = '${params.sex}'`;
                else  if (params.orientation.localeCompare('straight') === 0) {
                    part = `AND orientation IN ('straight', 'bisexual') AND sex != '${params.sex}'`;
                }
                else {
                    part = `AND (orientation != 'straight' OR sex != '${params.sex}') `
                }

            }
            let sort = 'distance';
            if (params.order_field.localeCompare('distance') === 0 ||
                params.order_field.localeCompare('age') === 0 ||
                params.order_field.localeCompare('num') === 0 ||
                params.order_field.localeCompare('rate') === 0)
                sort = params.order_field;
            let order = 'ASC';
            if (params.order.localeCompare('ASC') === 0 || params.order.localeCompare('DESC') === 0)
                order = params.order;
            if (params.max_dist === 100)
                params.max_dist = 45000;
            if (params.tags.length === 0)
                params.tags = [0];
            let sql = 'SELECT ' +
                '    innerTable.login, ' +
                '    COUNT(1) AS num, ' +
                '    innerTable.age, ' +
                '    innerTable.distance, ' +
                '    photo.url, ' +
                '    innerTable.sex, ' +
                '    innerTable.orientation, ' +
                '    innerTable.rate,' +
                '    innerTable.id, ' +
                '    innerTable.is_online,' +
                '    innerTable.last_seen  ' +
                'FROM' +
                '    ( ' +
                '    SELECT ' +
                '        users.login, ' +
                '        users.sex, '+
                '        users.orientation, '+
                '        users.id, ' +
                '        users.rate,   ' +
                '        users.is_online,   ' +
                '        DATE_FORMAT(users.last_seen, "(last seen at %H:%i, %Y-%m-%d)") as last_seen, ' +
                '        users.has_access, ' +
                '        TIMESTAMPDIFF(YEAR, users.bday, CURDATE()) AS age, ' +
                '        ROUND( ' +
                '            ( ' +
                '                ST_DISTANCE_SPHERE( ' +
                '                    POINT(?, ?), ' +
                '                    users.location ' +
                '                ) / 1000 ' +
                '            ), ' +
                '            3 ' +
                '        ) AS DISTANCE ' +
                '    FROM ' +
                '        users' +
                '    ) AS innerTable ' +
                '    INNER JOIN tags ON tags.user_id = innerTable.id ' +
                '    LEFT JOIN photo ON photo.user_id = innerTable.id ' +
                '    INNER JOIN black_list   '+
                '    WHERE ' +
                '        ( ' +
                '            DISTANCE >= ? AND DISTANCE <= ? AND tags.tag IN ? AND age >= ? AND age <= ? AND rate >= ? AND rate <= ?' +
                `        ) AND photo.is_avatar = TRUE AND innerTable.id != ? ${part}` +
                '          AND innerTable.id NOT IN (' +
                '           SELECT whom_id FROM black_list' +
                '           WHERE who_id = ?' +
                '            ) AND innerTable.has_access = 1'+
                '    GROUP BY ' +
                '        innerTable.login, ' +
                '        photo.url ' +
                `    ORDER BY ${sort} ` +
                `             ${order}` +
                '    LIMIT ?,100';
            return connection.query(sql,[params.user_lat,
                params.user_lon,
                params.min_dist,
                params.max_dist,
                [params.tags],
                params.age_min,
                params.age_max,
                params.min_rate,
                params.max_rate,
                params.user_id,
                params.user_id,
                params.last_id
            ] );
        }).then(result => {
            resolve(result);
        }).catch( reason => reject(reason));
    });
};

export {getSearch}
