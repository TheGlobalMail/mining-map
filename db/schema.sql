SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP table if exists public.datafiles;

CREATE TABLE datafiles (
    id varchar(50) NOT NULL,
    state varchar(20) NOT NULL,
    file varchar(50) NOT NULL,
    checksum char(32) NOT NULL
);
ALTER TABLE ONLY datafiles
    ADD CONSTRAINT datafiles_pkey PRIMARY KEY (id);

DROP table if exists public.features;
CREATE TABLE features (
    id varchar(100) NOT NULL,
    state varchar(20) NOT NULL,
    type varchar(50) NOT NULL,
    properties text NOT NULL,
    geometry text NOT NULL
);
ALTER TABLE ONLY features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);

CREATE INDEX featuers_state_idx ON features USING btree (state);