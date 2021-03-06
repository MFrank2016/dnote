/* Copyright (C) 2019, 2020 Monomax Software Pty Ltd
 *
 * This file is part of Dnote.
 *
 * Dnote is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Dnote is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Dnote.  If not, see <https://www.gnu.org/licenses/>.
 */

import classnames from 'classnames';
import { RepetitionRuleData } from 'jslib/operations/types';
import React, { useState } from 'react';
import {
  msToDuration,
  msToHTMLTimeDuration,
  relativeTimeDiff,
  timeAgo
} from 'web/helpers/time';
import Time from '../../Common/Time';
import Actions from './Actions';
import BookMeta from './BookMeta';
import styles from './RepetitionItem.scss';

interface Props {
  item: RepetitionRuleData;
  setRuleUUIDToDelete: React.Dispatch<any>;
  pro: boolean;
}

function formatLastActive(ms: number): string {
  return timeAgo(ms);
}

function formatNextActive(ms: number): string {
  const now = new Date().getTime();
  const diff = relativeTimeDiff(now, ms);

  return diff.text;
}

const RepetitionItem: React.FunctionComponent<Props> = ({
  item,
  pro,
  setRuleUUIDToDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className={classnames(
        styles.wrapper,
        'T-repetition-item',
        `T-repetition-item-${item.uuid}`
      )}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.left}>
          <h2 className={classnames(styles.title, 'T-repetition-rule-title')}>
            {item.title}
          </h2>

          <div className={styles.meta}>
            <div>
              <span className={styles.frequency}>
                Every{' '}
                <time dateTime={msToHTMLTimeDuration(item.frequency)}>
                  {msToDuration(item.frequency)}
                </time>
              </span>
              <span className={styles.sep}>&middot;</span>
              <span className={styles.delivery}>email</span>
            </div>

            <BookMeta
              bookDomain={item.bookDomain}
              bookCount={item.books.length}
            />
          </div>
        </div>

        <div className={styles.right}>
          <ul className={classnames('list-unstyled', styles['detail-list'])}>
            <li>
              {item.enabled && item.nextActive !== 0 ? (
                <span>
                  Scheduled in{' '}
                  <Time
                    id={`${item.uuid}-lastactive-ts`}
                    text={formatNextActive(item.nextActive)}
                    ms={item.nextActive}
                    tooltipAlignment="center"
                    tooltipDirection="bottom"
                  />
                </span>
              ) : (
                <span>Not scheduled</span>
              )}
            </li>
            <li>
              Last active:{' '}
              {item.lastActive === 0 ? (
                <span>Never</span>
              ) : (
                <Time
                  id={`${item.uuid}-lastactive-ts`}
                  text={formatLastActive(item.lastActive)}
                  ms={item.lastActive}
                  tooltipAlignment="center"
                  tooltipDirection="bottom"
                />
              )}
            </li>
            {/*
            <li>
              Created:{' '}
              <Time
                id={`${item.uuid}-created-ts`}
                text={formatTime(new Date(item.createdAt), '%YYYY %MMM %Do')}
                ms={new Date(item.createdAt).getTime()}
                tooltipAlignment="center"
                tooltipDirection="bottom"
              />
            </li>
              */}
          </ul>
        </div>
      </div>

      <Actions
        isActive={isHovered}
        onDelete={() => {
          setRuleUUIDToDelete(item.uuid);
        }}
        repetitionUUID={item.uuid}
        disabled={!pro}
      />
    </li>
  );
};

export default RepetitionItem;
